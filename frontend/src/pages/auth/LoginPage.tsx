import {type FormEvent, useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../../hooks/use.auth.ts";
import {handleError} from "../../utls/error.handler.ts";

function LoginPage() {
    const {login} = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await login({username, password});
        } catch (err) {
            handleError(err as Error, "Не удалось войти.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-neutral-950">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
            >
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    Вход
                </h1>

                <div className="space-y-1">
                    <label htmlFor="username" className="text-sm text-neutral-600 dark:text-neutral-400">
                        Логин
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:text-neutral-50"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm text-neutral-600 dark:text-neutral-400">
                        Пароль
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:text-neutral-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-neutral-900 py-2 text-white transition-opacity disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900"
                >
                    {isSubmitting ? "Входим..." : "Войти"}
                </button>

                <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                    Нет аккаунта?{" "}
                    <Link to="/auth/register" className="font-medium text-neutral-900 underline dark:text-neutral-50">
                        Зарегистрироваться
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
