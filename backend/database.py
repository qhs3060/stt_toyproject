# backend/database.py

import databases
import sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String

DATABASE_URL = "postgresql://postgres:1234@localhost:5432/snubh"

# 데이터베이스 연결 설정
database = databases.Database(DATABASE_URL)
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
