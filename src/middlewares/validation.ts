interface AccountDataBody {
    restaurantName: string;
    cnpj?: string;
    ownersName: string;
    cpf: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export const validateSignUpFields = (body: AccountDataBody): string | null => {
    const requiredFields = ['restaurantName', 'ownersName', 'cpf', 'phoneNumber', 'email', 'password'];

    for (const field of requiredFields) {
        if (!body[field as keyof AccountDataBody]) {
            return 'Campos obrigatórios';
        }
    }

    return null;
}

export const validateLoginFields = (body: AccountDataBody): string | null => {
    const { email, password } = body;

    if (!email || !password) {
        return 'Campos obrigatórios';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Email inválido';
    }

    if (password.length < 6) {
        return 'Senha muito curta';
    }

    return null;
}