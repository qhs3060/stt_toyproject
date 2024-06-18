# backend/app/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Query, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.stt import load_model, transcribe_audio
from database import database, stt_table
import os
from datetime import datetime
from sqlalchemy import select
import asyncio

app = FastAPI()

# CORS 설정 업데이트
origins = [
    "http://localhost:3000",  # 프론트엔드 서버 주소
    "*",  # 모든 도메인 허용 (개발 시에만 사용, 배포 시에는 특정 도메인만 허용)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Whisper 모델 로드
model = load_model()

# 현재 스크립트 파일의 절대 경로를 기준으로 상대 경로를 절대 경로로 변환
current_dir = os.path.dirname(os.path.abspath(__file__))
audio_dir = os.path.join(current_dir, "../audio")

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
def read_root():
    return {"message": "Welcome to the STT service. Use POST /stt/ to upload your audio file."}

# table2 엔드포인트에 페이징 추가
@app.get("/table2/")
async def get_table2_data(page: int = Query(1), limit: int = Query(10)):
    offset = (page - 1) * limit
    query = f"SELECT * FROM table2 OFFSET {offset} LIMIT {limit}"
    rows = await database.fetch_all(query)

    def serialize_row(row):
        row_dict = dict(row)
        if 'datetime' in row_dict:
            row_dict['datetime'] = row_dict['datetime'].isoformat()  # datetime 필드를 문자열로 변환
        return row_dict

    serialized_rows = [serialize_row(row) for row in rows]
    return JSONResponse(content={"data": serialized_rows, "page": page, "limit": limit})

# table1의 특정 pact_id에 해당하는 데이터를 가져오는 엔드포인트 추가
@app.get("/table1/{pact_id}")
async def get_table1_data(pact_id: int = Path(...)):
    query = f"SELECT * FROM table1 WHERE pact_id = :pact_id"
    rows = await database.fetch_all(query, values={"pact_id": pact_id})

    if not rows:
        raise HTTPException(status_code=404, detail="No data found for the specified pact_id")

    return JSONResponse(content={"data": [dict(row) for row in rows]})

# 음성 파일 업로드와 비동기 STT 처리
@app.post("/stt/")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # audio 디렉토리가 존재하지 않으면 생성
        if not os.path.exists(audio_dir):
            os.makedirs(audio_dir)

        # 파일을 절대 경로로 저장
        file_location = os.path.join(audio_dir, file.filename)
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Whisper STT 작업을 비동기적으로 처리
        loop = asyncio.get_event_loop()
        transcription_task = loop.run_in_executor(None, transcribe_audio, model, file_location)

        # STT 작업을 백그라운드로 진행하고 즉시 응답 반환
        return JSONResponse(content={"message": "File uploaded and STT processing started"})

    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"}, status_code=500)

# STT 결과를 나중에 가져오는 엔드포인트
@app.get("/stt_result/{file_name}")
async def get_stt_result(file_name: str):
    file_location = os.path.join(audio_dir, file_name)
    transcription = transcribe_audio(model, file_location)

    if transcription:
        # 데이터베이스에 결과 저장
        query = stt_table.insert().values(transcription=transcription)
        await database.execute(query)

        return JSONResponse(content={"text": transcription})
    else:
        raise HTTPException(status_code=500, detail="STT conversion failed.")

@app.post("/realtime_stt/")
async def realtime_stt(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # 타임스탬프를 사용하여 파일 이름 생성
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        file_name = f"realtime_recording_{timestamp}.mp3"
        file_location = os.path.join(audio_dir, file_name)

        # 파일 저장
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # 음성 파일을 텍스트로 변환
        transcription = transcribe_audio(model, file_location)

        if transcription:
            return JSONResponse(content={"text": transcription})
        else:
            raise HTTPException(status_code=500, detail="STT conversion failed.")
    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"}, status_code=500)

# /save_transcription/ 경로에 대한 POST 요청 처리
class TranscriptionRequest(BaseModel):
    transcription: str

@app.post("/save_transcription/")
async def save_transcription(request: TranscriptionRequest):
    try:
        transcription = request.transcription
        if not transcription:
            raise HTTPException(status_code=400, detail="No transcription provided")

        # 데이터베이스에 결과 저장
        query = stt_table.insert().values(transcription=transcription)
        await database.execute(query)

        return JSONResponse(content={"message": "Transcription saved successfully"})
    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)