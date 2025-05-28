import * as bcrypt from 'bcrypt';

export class HashPassword {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.SALT_ROUNDS);
    } catch (error) {
      throw new Error('Erro ao gerar hash da senha', error);
    }
  }

  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Erro ao comparar senhas', error);
    }
  }
}
