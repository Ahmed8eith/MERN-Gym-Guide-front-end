import React, { useState, useEffect } from "react";

const Animation = ({ onComplete }) => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [glitchedText1, setGlitchedText1] = useState("");
  const [glitchedText2, setGlitchedText2] = useState("");
  const [isGlitching, setIsGlitching] = useState(false);

  const fullText1 = "When you want to give up";
  const fullText2 = "Remember why you started.";
  const glitchChars = "!@#$%^&*()<>[]{}|?/\\XYZ";

  const getRandomGlitchChar = () => {
    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
  };

  const glitchText = (text) => {
    if (!text) return "";
    let glitched = text.split("").map((char) => ({
      char: char,
    }));

    const numGlitches = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numGlitches; i++) {
      const pos = Math.floor(Math.random() * text.length);
      const action = Math.random();

      if (action < 0.33) {
        glitched[pos] = {
          char: getRandomGlitchChar(),
        };
      } else if (action < 0.66) {
        glitched[pos] = { char: "" };
      } else {
        glitched[pos] = {
          char: glitched[pos].char + getRandomGlitchChar(),
        };
      }
    }
    return glitched;
  };

  useEffect(() => {
    if (text1.length < fullText1.length) {
      const timeout = setTimeout(() => {
        setText1(fullText1.slice(0, text1.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (!showSecondText) {
      const timeout = setTimeout(() => {
        setShowSecondText(true);
      }, 500);
      return () => clearTimeout(timeout);
    } else if (text2.length < fullText2.length) {
      const timeout = setTimeout(() => {
        setText2(fullText2.slice(0, text2.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      const timeout = setTimeout(() => {
        setIsComplete(true);
        setIsGlitching(true);

        setTimeout(() => {
          setIsGlitching(false);

          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setShouldRender(false);
              onComplete(); // Call the onComplete callback when animation is done
            }, 300);
          }, 500);
        }, 1000);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [text1, text2, isComplete, showSecondText, onComplete]);

  useEffect(() => {
    if (isGlitching) {
      const glitchInterval = setInterval(() => {
        setGlitchedText1(glitchText(text1));
        setGlitchedText2(glitchText(text2));
      }, 50);

      return () => clearInterval(glitchInterval);
    } else {
      setGlitchedText1(text1);
      setGlitchedText2(text2);
    }
  }, [isGlitching, text1, text2]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black
      transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white font-mono">
          {isComplete ? (
            <span>
              {typeof glitchedText1 === "string"
                ? glitchedText1
                : glitchedText1.map((char, i) => <span key={i}>{char.char}</span>)}
            </span>
          ) : (
            text1
          )}
        </h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-mono">
          {isComplete ? (
            <span>
              {typeof glitchedText2 === "string"
                ? glitchedText2
                : glitchedText2.map((char, i) => <span key={i}>{char.char}</span>)}
            </span>
          ) : (
            text2
          )}
        </h1>
      </div>
    </div>
  );
};

export default Animation;
