import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import BoxButton from "../BoxButton";
import { getImageUrl } from "../../util/helper";

const CreateComment = ({ onCommentAdded, isCommentClicked, setIsCommentClicked }) => {
    const [comment, setComment] = useState('');
    const { user } = useAuth();

    const handleSubmit = (e) => {
        onCommentAdded(e, comment); 
        setComment('');
    };

    return (
        <div className="mt-2 flex mr-3 md:mr-0">
            {user?.image_url ? (
                <img src={getImageUrl(user.image_url)} className={`rounded-full transition-all duration-300 ${isCommentClicked ? 'w-12 h-12' : 'w-9 h-9'}`}/>
            ) : (
                <img src="/public/default_avatar.jpg" className={`rounded-full transition-all duration-300 ${isCommentClicked ? 'w-12 h-12' : 'w-9 h-9'}`}/>
            )}
            <form className="w-full" onSubmit={handleSubmit}>
                    <textarea name="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a whisper in the archives..." 
                    className={`ml-2 w-full bg-black/20 border-b border-parchment/10 px-2 pt-2 focus:outline-none
                        focus:border-main-accent transition-all duration-500 resize-none overflow-y-auto ${isCommentClicked ? 'h-32 bg-black/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]' : 'h-10'}`}
                    onClick={() => setIsCommentClicked(true)}
                    />
                    <div className={`w-full flex justify-end mt-3 gap-3 transition-all duration-500 ease-in-out 
                        ${isCommentClicked ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 -translate-y-2 h-0 overflow-hidden pointer-events-none'}`}>
                        <button onClick={(e) => {
                            e.preventDefault();
                            setComment('');
                            setIsCommentClicked(false)}} 
                        className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-parchment/60 
                            hover:text-parchment hover:bg-white/5 transition-all duration-300 
                            border border-transparent hover:border-parchment/10">
                            Cancel
                        </button>
                        <BoxButton text={"Cast Whisper"} color={"main-accent"} type="submit"/>
                    </div>
            </form>
        </div>
    );

}

export default CreateComment;