

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary-bg">
            <h1 className="text-6xl font-bold text-main-accent">404</h1>
            <p className="text-2xl text-main-accent/80 mt-4">Page Not Found</p>
            <p className="text-main-accent/80 mt-2">The page you are looking for does not exist.</p>
        </div>
    );
};

export default NotFoundPage;    