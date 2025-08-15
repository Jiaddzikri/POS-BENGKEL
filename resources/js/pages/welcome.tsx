import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacitiy duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-lg p-6 pb-12 text-[13px] leading-[20px] lg:p-20 bg-animated-gradient text-foreground">
                            <h1 className='text-center text-4xl font-extrabold tracking-tight text-balance mb-5'>
                                Point Of Sale Bengkel
                            </h1>
                            <hr className='hr-animated-gradient'/>
                            <p className='mt-4 text-justify'>
                                Sistem <strong>Point of Sale (POS) Bengkel</strong> ini dirancang untuk membantu
                                pengelolaan transaksi, stok suku cadang, dan pencatatan layanan secara cepat dan
                                akurat. Dengan antarmuka yang sederhana dan responsif, teknisi maupun kasir dapat
                                memproses order, mencetak struk, serta memantau laporan penjualan kapan saja dan di
                                mana saja. Cocok untuk bengkel motor maupun mobil yang ingin meningkatkan efisiensi
                                operasional dan kepuasan pelanggan.
                            </p>
                        </div>
                    </main>
                </div>


                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
