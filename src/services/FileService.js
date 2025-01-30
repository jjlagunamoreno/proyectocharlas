import axios from 'axios';
import Global from '../utils/Global';

const FileService = {
  uploadUserImage: async (userId, fileName, fileContent) => {
    const url = `https://apicharlasalumnostajamar.azurewebsites.net/api/Files/UploadImagenUsuario/${userId}`;
    const data = {
      fileName: fileName,
      fileContent: fileContent
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': Global.token
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  uploadCharlaImage: async (charlaId, fileName, fileContent) => {
    const url = `https://apicharlasalumnostajamar.azurewebsites.net/api/Files/UploadImagenCharla/${charlaId}`;
    const data = {
      fileName: fileName,
      fileContent: fileContent,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: Global.token,
    };
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.error("❌ Error subiendo imagen de la charla:", error);
      throw error;
    }
  },
};

export default FileService;
