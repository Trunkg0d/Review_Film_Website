from fastapi import FastAPI, UploadFile, APIRouter
from pathlib import Path

import logging

UPLOAD_DIR = Path() / 'uploads'

logger = logging.getLogger('uvicorn.error')

upload_router = APIRouter(
    tags=['Upload']
)

@upload_router.post('/upload')
async def upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / file_upload.filename
    with open(save_to, 'wb') as f:
        f.write(data)
    return {'filename': file_upload.filename}




    