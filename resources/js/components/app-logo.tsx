import AppLogoIcon from './app-logo-icon';

export default function AppLogo({ subtitle = 'Customer' }: { subtitle?: string }) {
    return (
        <div className="flex items-center gap-3.5">
            <AppLogoIcon className="h-16 w-auto" />
            <div className="flex flex-col justify-center min-w-0">
                <span className="font-lora italic font-semibold leading-tight tracking-tight text-sm text-sky-700">
                    San Antonio Water System Association
                </span>
            </div>
        </div>
    );
}