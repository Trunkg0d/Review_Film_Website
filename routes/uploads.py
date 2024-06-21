from fastapi import FastAPI, UploadFile, APIRouter, File
from fastapi.responses import JSONResponse
from pathlib import Path
import aiofiles
import random
import string
import logging
import datetime

UPLOAD_DIR = Path() / 'uploads'

logger = logging.getLogger('uvicorn.error')

upload_router = APIRouter(
    tags=['Upload']
)


def generate_random_name():
    characters = string.ascii_letters + string.digits
    random_name = ''.join(random.choice(characters) for _ in range(16))
    datetime_str = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    return f"{datetime_str}_{random_name}"

@upload_router.post("/image")    
async def upload_file(file: UploadFile = File(...)):
    file_extension = file.filename.split('.')[-1]
    if not file_extension:
        return JSONResponse({"error": "File does not have an extension"}, status_code=400)
    filename = f"{generate_random_name()}.{file_extension}"
    file_location = UPLOAD_DIR / filename
    async with aiofiles.open(file_location, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    return JSONResponse({"filename": filename, "size": len(content)})
    
