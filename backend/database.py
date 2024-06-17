# backend/database.py

import os
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from databases import Database
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

# 환경 변수에서 DATABASE_URL 가져오기
DATABASE_URL = os.getenv('DATABASE_URL')

# 데이터베이스 연결 설정
database = Database(DATABASE_URL)
metadata = MetaData()

# 테이블 정의
stt_table = Table(
    "stt_table",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("transcription", String, nullable=False),
)

# 데이터베이스 엔진 생성 및 테이블 생성
engine = create_engine(DATABASE_URL)
metadata.create_all(engine)