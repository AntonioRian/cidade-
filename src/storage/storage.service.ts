import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class StorageService {
  private firebaseService: FirebaseService;

  constructor() {
    this.firebaseService = new FirebaseService();
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileUrl = await this.firebaseService.uploadFile(file);

    return fileUrl;
  }
}
