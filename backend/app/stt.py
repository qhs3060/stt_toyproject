import whisper
import numpy as np
from pydub import AudioSegment
from typing import Union

def load_model():
    # Whisper large 모델 로드
    return whisper.load_model("large")

def transcribe_audio(model, audio_file_path: str) -> Union[str, None]:
    try:
        # 오디오 파일 로드
        audio = AudioSegment.from_file(audio_file_path)
        audio = audio.set_frame_rate(16000)  # 샘플링 레이트를 16kHz로 설정

        # 오디오를 numpy 배열로 변환
        audio_data = np.array(audio.get_array_of_samples(), dtype=np.float32) / 32768.0  # 범위를 [-1, 1]로 변환

        # Whisper 모델을 사용하여 변환
        result = model.transcribe(audio_data)
        return result['text']
    except Exception as e:
        print(f"변환 중 오류 발생: {e}")
        return None
