import { useState, useEffect } from 'react';
import styles from './loadingScreen.module.css';
import Image from 'next/image';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

    }, []);

    return (
        isLoading ? (
            <div className={styles.mainLoadingDiv}>
                <div>
                    <Image
                        src="/piggybank.png"
                        alt="Loading"
                        width={100}
                        height={100}
                        className={styles.vercelImg}
                    />
                    <p>Jhon's piggy bank</p>
                </div>
            </div>
        ) : null
    );
}
