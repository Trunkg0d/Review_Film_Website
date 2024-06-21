import { useState } from "react";
import { FiUpload } from "react-icons/fi";
import axios from 'axios';
import './Upload.css';

export default function UploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  // const [dragActive, setDragActive] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const checkFileType = (e, eventType) => {
    let extension;

    if (eventType === "drop") {
      extension = e.dataTransfer.files[0].name.match(/\.([^.]+)$/)[1];
    } else {
      extension = e.target.value.match(/\.([^.]+)$/)[1];
    }

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "pdf":
        eventType !== "drop"
          ? setFile(e.target.files[0])
          : setFile(e.dataTransfer.files[0]);
        setMsg("");
        break;
      default:
        setFile(null);
        setMsg(`.${extension} format is not supported.`);
    }
  };

  const checkSize = (e, eventType) => {
    let size;
    if (eventType === "drop") {
      size = e.dataTransfer.files[0].size / 8;
    } else {
      size = e.target.files[0].size / 8;
    }

    if (size <= 20971520) { // 20 Mebibytes
      checkFileType(e, eventType);
    } else {
      setMsg("Size should be less than 20MB");
    }
  };

  const chooseFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      checkSize(e);
      uploadFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // if (e.type === "dragenter" || e.type === "dragover") {
    //   setDragActive(true);
    // } else if (e.type === "dragleave") {
    //   setDragActive(false);
    // }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      checkSize(e, "drop");
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {

      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8000/user/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      setMsg('File uploaded successfully');
      onSuccess();
    } catch (error) {
      setMsg('File upload failed');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modalOuter">
      <div className="modalBox">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <h3 className="heading">Upload your file</h3>
        <form
          className="uploadBox"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onSubmit={(e) => e.preventDefault()}
        >
          {file !== null ? (
            <p className="filename">{file.name}</p>
          ) : msg !== "" ? (
            msg
          ) : (
            <FiUpload className="upload-icon" />
          )}

          <div>
            <div className="drag">
              Drop your file here or{" "}
              <div className="browse">
                <label
                  htmlFor="img"
                  className="file-label"
                  onClick={() => document.getElementById("getFile").click()}
                >
                  Browse
                  <input
                    type="file"
                    data-max-size="2048"
                    id="getFile"
                    className="fileIcon"
                    onChange={chooseFile}
                  />
                </label>
              </div>
            </div>
          </div>

          <p className="info">Supported files: JPEG, PNG, PDF</p>
        </form>
        {uploading && <div className="progress-bar"><div className="indeterminate"></div></div>}
      </div>
    </div>
  );
}
