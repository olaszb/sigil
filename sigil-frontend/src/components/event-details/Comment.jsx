import { useAuth } from "../../contexts/AuthContext";
import { formatArchiveDate } from "../../util/helper";

const Comment = ({ comment, handleDeleteComment }) => {
    const { user } = useAuth();
    return (
        <div className="relative flex gap-4 group mt-6">
            <div className="flex flex-col items-center">
                <img 
                    src={ "/public/default_avatar.jpg"} 
                    className="w-10 h-10 rounded-full border border-parchment/10 z-10 bg-secondary-bg"
                />
            </div>

            <div className="flex-1 pb-8">
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-[Cinzel] text-sm text-main-accent tracking-wider">
                        {comment.user.name}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-tighter text-parchment/30">
                        {formatArchiveDate(comment.created_at)}
                    </span>
                </div>

                <div className="relative p-4 bg-black/20 border-l-2 border-main-accent/50 hover:border-main-accent/50 transition-colors duration-500">
                    <p className="text-sm leading-relaxed text-parchment/80 font-light">
                        {comment.comment}
                    </p>
                    
                    <div className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {(user?.id === comment.user_id || user?.role === 'admin') && (
                            <button 
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-[10px] uppercase tracking-widest text-main-accent/40 hover:text-main-accent transition-colors"
                            >
                                Banish
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;