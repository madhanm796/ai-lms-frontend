import React from 'react'

function ButtonWithText({ text, isLoading}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
    >
      {text}
    </button>
  )
}

export default ButtonWithText