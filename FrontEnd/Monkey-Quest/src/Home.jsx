function Home(){
    return(
        <>
        <div class="container">
            <div class="left-section">
                <div class="logo-image">
                    <img src="img/logo2.png" alt="MonkeyQuest Logo" />
                </div>
                <div class="popup-section"></div>
            </div>
            <div class="right-section">
                <div class="Monkey-message-section">
                    <div class="text-box" id="monkeyText"></div>
                </div>
                <div class="play-dashboard">
                    <button class="play"><img src="img/playImg.png" alt="play" /></button>
                </div>
            </div>
        </div>
        </>
    );
}

export default Home 