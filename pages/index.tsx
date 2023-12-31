/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import axios from "axios";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GoUnmute, GoMute } from "react-icons/go";
import cn from "classnames";
import { OnProgressProps } from "react-player/base";
import Button from "@atoms/Button";
import { FaPlay } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
import { TbChecks } from "react-icons/tb";
import { MdRemove } from "react-icons/md";
import { urls } from "service/urls";
import HorizontalAnimeTile from "organisms/HorizontalAnimeTile";
import Link from "next/link";
import { useMutedStore } from "store/useMuted";
import { useMyListStore } from "store/MyListStore";
import {
  addItemToMyListFireStore,
  deleteMyListItemFireStore,
} from "../firebase/MyListFireStore/helpers";
import { useAuthStore } from "Auth";
import RecentAnimeTime from "@molecules/RecentAnimeTile";
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

const HomePage: NextPage = ({
  home,
  recentEpisodes,
  trending,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [playing, setPlaying] = useState(false);
  const [muted, toggleMute] = useMutedStore((state) => [
    state.muted,
    state.toggleMute,
  ]);
  const user = useAuthStore((state) => state.user);
  const myList = useMyListStore((state) => state.myList);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaying(true);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const HandleTransition = (state: OnProgressProps) => {
    const { playedSeconds } = state;
    if (playedSeconds > 30) {
      setPlaying(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-[40vh] sm:h-[50vh]  md:h-[80vh] relative w-full flex">
        <ReactPlayer
          url={home.youtube_url}
          className="react-player"
          playing={playing}
          muted={muted}
          width="100%"
          height="100%"
          volume={0.6}
          onProgress={HandleTransition}
        />
        <div className="absolute w-full h-full">
          <img
            className={cn(
              "h-full w-full transition-opacity ease-in duration-500 object-cover",
              { "opacity-0": playing }
            )}
            src={home.cover_url}
            alt="cover"
          />
          <div className="main | absolute pl-5 md:pl-20 bottom-0 h-full w-full bg-gradient-to-t from-black  flex flex-col-reverse">
            <div className="">
              <img
                className={cn(
                  "h-10 md:h-20 w-fit scale-150 duration-1000 -translate-y-10 origin-bottom-left transition-transform",
                  { "scale-100 translate-y-0": playing }
                )}
                src={home.logo_url}
                alt="Title"
              />
              <p
                className={cn(
                  "py-4 w-1/2 hidden md:block transition-opacity duration-500",
                  { "opacity-0": playing }
                )}
              >
                {(home.description as string).substring(0, 200)}...
              </p>
              <div className="flex my-5 mb-10 gap-4 lg:gap-6">
                <Link href={`/anime/watch/${home.episode_id}`} passHref>
                  <Button
                    type="primary"
                    className="lg:py-4 lg:px-10 lg:text-2xl"
                    onClick={
                      () => {}
                      // router.push(`/anime/watch/${home.episode_id}`)
                    }
                  >
                    <FaPlay /> Play
                  </Button>
                </Link>

                {myList[home.id] ? (
                  <div className="flex gap-2">
                    <Button type="secondary" onClick={() => {}}>
                      <TbChecks className="w-5 h-5 tick-animate" />
                    </Button>
                    <Button
                      className="fade-right"
                      type="secondary"
                      onClick={() => {
                        deleteMyListItemFireStore(home.id);
                      }}
                    >
                      <MdRemove className="w-5 h-5" />
                    </Button>
                  </div>
                ) : user ? (
                  <Button
                    className="lg:py-4 lg:px-10 lg:text-2xl"
                    type="secondary"
                    onClick={() =>
                      addItemToMyListFireStore({
                        id: home.id,
                        name: home.name,
                        image: home.image,
                        type: home.type,
                      })
                    }
                  >
                    <BsPlusLg /> My List
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="controls absolute bottom-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {muted ? (
                <GoMute className="w-10 h-10" color="#fff" />
              ) : (
                <GoUnmute className="w-10 h-10" color="#fff" />
              )}
            </button>
          </div>
        </div>
      </div>

      <section className="pl-5 pb-20 md:pl-20 mt-2">
        <h2 className="text-2xl">New Releases</h2>
        <HorizontalAnimeTile
          data={recentEpisodes}
          Component={RecentAnimeTime}
        />
      </section>

      {/* <section className="pl-5 md:pl-20 mt-10">
        <h2 className="text-xl">Trending Anime</h2>
        <HorizontalAnimeTile data={trending} />
      </section> */}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const HOME_TILES = [
    {
      id: "120377",
      name: "Edge runners",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx120377-p2PmPHb6Zwk0.jpg",
      type: "ONA",
      description:
        "CYBERPUNK: EDGERUNNERS tells a standalone, 10-episode story about a street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner—a mercenary outlaw also known as a cyberpunk.",
      youtube_url: "https://www.youtube.com/watch?v=JtqIas3bYhg",
      cover_url: "/covers/EdgeRunner_cover.jpg",
      logo_url: "/logos/Cyberpunk_Edgerunners_logo.png",
      episode_id: "cyberpunk-edgerunners-episode-1",
    },
    {
      id: "141391",
      name: "Yofukashi no Uta",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx141391-rEJ1hm9i2PFa.jpg",
      type: "TV",
      description:
        "Wracked by insomnia and wanderlust, Kou Yamori is driven onto the moonlit streets every night in an aimless search for something he can’t seem to name. His nightly ritual is marked by purposeless introspection — until he meets Nazuna, who might just be a vampire! Kou’s new companion could offer him dark gifts and a vampire’s immortality. But there are conditions that must be met before Kou can sink his teeth into vampirism, and he’ll have to discover just how far he’s willing to go to satisfy his desires before he can heed the Call of the Night!",
      youtube_url: "https://www.youtube.com/watch?v=ukO-ZdWS3j8",
      cover_url: "/covers/call-of-the-night-cover.jpg",
      logo_url: "/logos/Call_of_the_night_logo.png",
      episode_id: "yofukashi-no-uta-episode-1",
    },
    {
      id: "129201",
      image:
        "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx129201-HJBauga2be8I.png",
      name: "Summer Time Render",
      type: "TV",
      description:
        "A sci-fi, summer story filled with suspense set on a small island with Shinpei Aijiro, whose childhood friend Ushio Kofune died. He returns to his hometown for the first time in two years for the funeral. Sou Hishigata, his best friend, suspects something's off with Ushio's death, and that someone can die next.A sinister omen is heard as an entire family next door suddenly disappears the following day. Furthermore, Mio implicates a \"shadow\" three days before Ushio's death.",
      youtube_url: "https://www.youtube.com/watch?v=_JgOMtS2FkE",
      cover_url: "https://images6.alphacoders.com/118/1182991.jpg",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/6/69/Summer_Time_Rendering_logo.png",
      episode_id: "summertime-render-episode-1",
    },
  ];

  // Fetch Recent releases
  const recent = await axios.get(
    `${process.env.BASE_URL + urls.recentEpisodes}`
  );
  const trending = await axios.get(`${process.env.BASE_URL + urls.trending}`);
  return {
    props: {
      home: HOME_TILES[Math.floor(Math.random() * HOME_TILES.length)],
      recentEpisodes: recent.data.results,
      trending: trending.data.results,
    },
    revalidate: 60,
  };
};

export default HomePage;
