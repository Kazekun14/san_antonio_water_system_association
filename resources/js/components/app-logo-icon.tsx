import { cn } from '@/lib/utils';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return <img {...props} className={cn('object-contain', className)} src="/logo.svg" alt="App Logo" />;
}
