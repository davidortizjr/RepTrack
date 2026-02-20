import React from 'react';

interface NavbarProps {
    title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'RepTrack' }) => {
    return (
        <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-2xl">fitness_center</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-card-dark flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">notifications</span>
                </button>
                <button className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjx8WjcjNGPCUV1Yc9UXaix29xKJ9lvW80WgBZfIzz43UQoCyDtRcXJX-xNjB0f__atmDadqxTL89Ly_-qo3Rh3CYl6irHBWNyKbxD_UVcccsRJjCE69HnLXidHmZn787Xc8TC6pcgrZi_gL0N16SkkZGNUldcjbWWbDq_EdTxdR4X-AA9yg7l7It4ZpGqkYMJNEvGiMMoiBzuGBx8NSFwo0-mdrgZZJQEWFhzScgISBYbIw3IN_CbAKr5YlHHQNuNcniPhjZyCEFJ"
                        alt="Profile"
                    />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
