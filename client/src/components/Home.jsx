import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";
import { useNavigate, useNavigation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { analizeSentiment } from "../apis/api";
import { toast } from "react-toastify";
import Loading from "./Loading";

function Home() {
  const navigator = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");

  function getYouTubeVideoID(url) {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      if (hostname.includes("youtube.com")) {
        if (parsedUrl.pathname === "/watch") {
          return parsedUrl.searchParams.get("v");
        }
        if (
          parsedUrl.pathname.startsWith("/shorts/") ||
          parsedUrl.pathname.startsWith("/embed/") ||
          parsedUrl.pathname.startsWith("/v/")
        ) {
          return parsedUrl.pathname.split("/")[2];
        }
      }
      if (hostname.includes("youtu.be")) {
        return parsedUrl.pathname.substring(1);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  const mutation = useMutation({
    mutationFn: (videoId) => analizeSentiment(videoId),
    onSuccess: (_, videoId) => {
      navigator(`/analytics/${videoId}`);
      // console.log("Analysis completed successfully");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });
  if (mutation.isLoading) {
    return <Loading />;
  }
  const handleAnalyze = () => {
    const videoId = getYouTubeVideoID(videoUrl);
    if (videoId) {
      mutation.mutate(videoId);
      if (mutation.isLoading) {
        return <Loading />;
      }
    } else {
      toast.error("Invalid YouTube URL");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-3xl ">YouTube Comment Analyzer</h1>
      <h2 className="text-md text-slate-400 ">
        <TypeAnimation
          sequence={[
            "Please enter the video URL along with ID",
            3000,
            "Analyze your video",
            3000,
            "Get graphical overview",
            3000,
          ]}
          wrapper="span"
          speed={75}
          style={{ fontSize: "2em", display: "inline-block" }}
          repeat={Infinity}
        />
      </h2>
      <div className="w-full flex justify-center items-center">
        <TextField
          className="p-1 w-2/6"
          sx={{ margin: "1vmax" }}
          id="outlined-basic"
          label="Please enter the video URL"
          variant="outlined"
          onChange={(e) => setVideoUrl(e.target.value)}
        />
      </div>
      <Button
        onClick={handleAnalyze}
        sx={{ backgroundColor: "white", color: "black" }}
      >
        Analyze Comment
      </Button>
    </div>
  );
}

export default Home;
