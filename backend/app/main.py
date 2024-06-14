from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.stt import load_model, transcribe_audio
from database import database, stt_table
import os

app = FastAPI()

# CORS 설정
origins = [
    "http://localhost:3000",  # 프론트엔드 서버 주소
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

        # 음성 파일을 텍스트로 변환
        transcription = transcribe_audio(model, file_location)

        if transcription:
            # 데이터베이스에 결과 저장
            query = stt_table.insert().values(transcription=transcription)
            await database.execute(query)

            return JSONResponse(content={"text": transcription})
        else:
            raise HTTPException(status_code=500, detail="STT conversion failed.")

    except Exception as e:
        return JSONResponse(content={"error": f"An error occurred: {str(e)}"}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
