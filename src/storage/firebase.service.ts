import app from 'src/config/firebase.config';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // Adicionado para nome de arquivo único

export class FirebaseService {
  private storage: any; // Declarado aqui

  // Initialize Cloud Storage and get a reference to the service
  constructor() {
    this.storage = getStorage(app);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.buffer || !file.originalname || !file.mimetype) {
        throw new Error('Arquivo inválido ou informações do arquivo ausentes.');
      }

      // Cria um nome de arquivo único para evitar sobrescritas
      const fileName = `${uuidv4()}-${file.originalname}`;
      const storageRef = ref(this.storage, `images/${fileName}`);

      // Cria metadados para o arquivo, incluindo o tipo de conteúdo
      const metadata = {
        contentType: file.mimetype,
      };

      // Faz o upload do arquivo para o Firebase Storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata,
      );

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Upload bem-sucedido! URL:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo para o Firebase:', error);
      throw new Error(`Falha no upload do arquivo: ${error.message}`);
    }
  }
}
