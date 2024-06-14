from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from .stt import load_model, transcribe_audio  # 상대 경로로 stt 모듈 가져오기

app = FastAPI()

# Whisper 모델 로드
model = load_model()

@app.get("/")
def read_root():
    return {"message": "Welcome to the STT service. Use POST /stt/ to upload your audio file."}

@app.post("/stt/")
async def speech_to_text(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # 파일을 로컬에 저장
        file_location = f"audio/{file.filename}"
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)