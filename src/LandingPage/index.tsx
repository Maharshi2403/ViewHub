import Chat from "../components/Chat";

function LandingPage(){
    return(
        <>
          <nav className="flex flex-row h-1 w-full bg-black ">
            <span className="mr-2">Navigation</span>
            <span className="ml-2">Home</span>
          </nav>
          <Chat></Chat>

        </>
    )
}

export default LandingPage;