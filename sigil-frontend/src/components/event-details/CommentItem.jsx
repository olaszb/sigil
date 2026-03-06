import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { formatArchiveDate, getImageUrl } from "../../util/helper";
import axiosClient from "../../services/axios-client";
import { toast } from "react-toastify";
import { toastConfig } from "../../util/toastConfig";
import BoxButton from "../BoxButton";
import { Link } from "react-router-dom";

const CommentItem = ({ comment, handleDelete, type, onCommentUpdated }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.comment);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("CommentItem rendered with comment:", comment);
    }, [comment]);

    const handleUpdate = async () => {
        if (editText.trim() === comment.comment) { return setIsEditing(false); }
        setLoading(true);
        try{
            const response = await axiosClient.put(`/api/comments/${comment.id}`, { comment: editText});
            onCommentUpdated(response.data);
            setIsEditing(false);
            toast("Whisper altered in the archives!", toastConfig);
        }catch(err){
            console.error("Failed to update comment:", err);
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex gap-4 group mt-6">
            <div className="flex flex-col items-center">
                {type === 'eventDetails' ? (
                    <Link to={comment.user.name === user.name ? `/profile` : `/users/${comment.user.name}`} className="cursor-pointer">
                        <img 
                            src={getImageUrl(comment.user.image_url) || "/public/default_avatar.jpg"} 
                            className="w-10 h-10 rounded-full border border-parchment/10 z-10 bg-secondary-bg"
                        />
                    </Link>
                ) : (
                    <img 
                        src={getImageUrl(comment.user.image_url) || "/public/default_avatar.jpg"} 
                        className="w-10 h-10 rounded-full border border-parchment/10 z-10 bg-secondary-bg"
                    />
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    {type === 'eventDetails' && (
                        <Link to={comment.user.name === user.name ? `/profile` : `/users/${comment.user.name}`} className="cursor-pointer">
                            <span className="font-[Cinzel] text-sm text-main-accent tracking-wider">
                                {comment.user.name}
                            </span>
                        </Link>
                    )}
                    <span className="text-[9px] font-mono uppercase tracking-tighter text-parchment/30">
                        {formatArchiveDate(comment.created_at)}
                    </span>
                </div>

                <div className="relative p-4 bg-black/20 border-l-2 border-main-accent/50 hover:border-main-accent/50 transition-colors duration-500">
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full bg-black/40 border-b border-parchment/20 p-2 text-sm text-parchment focus:outline-none focus:border-main-accent resize-none h-20" 
                            />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsEditing(false)} 
                                className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-parchment/60 
                                    hover:text-parchment hover:bg-white/5 transition-all duration-300 
                                    border border-transparent hover:border-parchment/10">
                                    Cancel
                                </button>
                                <BoxButton onClick={handleUpdate} color={"main-accent"} disabled={loading} text={loading ? "Rewriting..." : "Save"}/>
                            </div>
                        </div>
                    ): (
                        <p className="text-sm leading-relaxed text-parchment/80 font-light">
                            {comment.comment}
                        </p>
                    )}
                    {type === 'eventDetails' && (
                        <div className="absolute top-1 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {(user?.id === comment.user_id) ? (
                                <>
                                    <button 
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-[10px] mr-4 uppercase tracking-widest text-main-accent/40 hover:text-main-accent transition-colors"
                                    >
                                        Banish
                                    </button>

                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="text-[10px] uppercase tracking-widest text-main-accent/40 hover:text-main-accent transition-colors"
                                    >
                                        Edit
                                    </button>
                                </>
                            ) : user?.role === 'admin' && (
                                <button 
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-[10px] mr-4 uppercase tracking-widest text-main-accent/40 hover:text-main-accent transition-colors"
                                >
                                    Banish
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommentItem;