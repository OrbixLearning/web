export class SecurityUtils {
	static isPasswordStrong(password: string | null | undefined): boolean {
		if (!password) return false;

		const hasMinLength = password.length >= 8;
		const hasLowercase = /[a-z]/.test(password);
		const hasUppercase = /[A-Z]/.test(password);
		const hasDigit = /\d/.test(password);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		return hasMinLength && hasLowercase && hasUppercase && hasDigit && hasSpecialChar;
	}
}
