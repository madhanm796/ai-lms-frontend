import googleIcon from '../assets/icons/google-icon.png';

function GoogleOAuth({title, onClick}) {
  return (
    <button
        onClick={onClick}
        type="button"
        className="w-full py-3 px-4 border-2 border-purple-400 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-3 hover:bg-purple-50 transition duration-200"
    >
        <img 
        src={googleIcon}
        alt="Google" 
        className="w-5 h-5"
        />
        {title}
    </button>
  )
}

export default GoogleOAuth