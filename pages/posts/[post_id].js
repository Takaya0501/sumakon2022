import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import styles from "../../styles/Home.module.css";

export default function Postview(props) {
  const router = useRouter();

  // const [postId, setPostId] = useState("");
  const [post, setPost] = useState({});
  // 自分の情報
  const [username, setUsername] = useState("");
  const [context, setContext] = useState("");

  // 表示されるコメント一覧
  const [comments, setComments] = useState([]);

  const [post_id, setPost_id] = useState("");

  //いいねの数
  const [favorites, setFavorites] = useState(0);

  const changeusername = (e) => {
    setUsername(e.target.value);
  };

  //
  const changeContext = (e) => {
    setContext(e.target.value);
  };

  const changepost_id = (e) => {
    setPost_id(e.target.value);
  };

  const changefavorite = (e) => {
    setFavorite(e.target.value);
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setPost_id(router.query.post_id);
  }, [router.isReady]);

  const getPost = (id) => {
    axios.get(`/api/get_post/${id}`).then((res) => {
      setPost(res.data);
      setFavorites(res.data.favorite);
    });
  };

  //いいね
  const getFavorite = (id) => {
    axios.get(`/api/get_favorite/${id}`).then((res) => {
      setPost(res.data);
    });
  };

  useEffect(() => {
    if (post_id === "") {
      return;
    }

    getPost(post_id);
  }, [post_id]);

  // いいね数を投稿する関数
  const postfavorite = () => {
    axios.post(`/api/add_favorite/${post_id}`).then(() => {
      setFavorites(favorites + 1);
      console.log("いいね完了しました");
    });
  };

  // コメントを投稿する関数
  const postcomments = () => {
    axios
      .post("/api/post_comments", {
        // APIに渡すJSONの中にauthorとcontextを入れる
        author: username,
        context: context,
        post_id: parseInt(post_id),
      })
      .then(() => {
        getComments();
        console.log("投稿完了しました");
      });
  };

  // コメント一覧を取得する関数
  const getComments = () => {
    axios.get(`/api/get_comments/${post_id}`).then((res) => {
      const json = res.data;
      setComments(json.comments);
      // setPostId = { id };
    });
  };

  // ページを読み込んだときに実行する処理
  useEffect(() => {
    if (post_id === "") {
      return;
    }
    getComments();
  }, [post_id]);

  //いいね
  var pics_src = new Array("/image/1.png", "/image/2.png");
  var num = 0;
  function slideshow() {
    if (num == 1) {
      num = 1;
    } else {
      num = 1;
    }
    document.getElementById("mypic").src = pics_src[num];
    console.log(pics_src[num]);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>すまこん：投稿を見る</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <h1>投稿を見る</h1>

          {post !== {} && (
            <div>
              <h1>{post.author}</h1>
              <div>
                {post.lat} / {post.lng}
              </div>
              <div>{post.publish_at}</div>
              {post.context}
              <div>
                <img src={post.image_url} alt="投稿画像" />
              </div>
              <div>
                <label onClick={postfavorite}>
                  <img
                    id="mypic"
                    onClick={slideshow}
                    src={"/image/1.png"}
                    width="100"
                    height="100"
                  />
                  {/* <button className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl">
                    いいね！！！！！！！
                  </button>{" "} */}
                </label>
                \
              </div>
              {favorites}
              {comments.map((info) => (
                // infoの中には、id、author、contextの3つが入っている(データベースはこの3つを格納しているから)
                <div key={info.id} className="pb-2">
                  {info.favorite}
                </div>
              ))}
              <div className="m-10 font-bold text-2xl text-center  border-gray-700 text-black flex flex-col justify-center items-center">
                <label
                  className="m-10 font-bold text-2xl text-center text-black flex flex-col justify-center items-center"
                  for="name"
                >
                  <h3>名前を入力して下さい。</h3>
                  <textarea
                    className="mt-5 border-2
                    w-96
                    border-gray-700 
                    text-center
                    resize-none
                    rounded-xl"
                    value={username}
                    onChange={changeusername}
                    name="text"
                    rows="1"
                    cols="40"
                    maxlength="40"
                  ></textarea>
                </label>
                <label for="first">
                  <h3>コメントを入力</h3>
                </label>
                <textarea
                  className="mt-5 border-2 w-96 border-neutral-500 rounded-xl resize-none"
                  value={context}
                  onChange={changeContext}
                  name="context"
                  style={{ resize: "none;" }}
                  rows="4"
                  cols="40"
                  maxlength="200"
                ></textarea>
              </div>
              <div>
                <button
                  onClick={postcomments}
                  className="mt-5 border-2 w-96 font-bold text-2xl border-gray-700 rounded-xl"
                >
                  コメントを投稿
                </button>
              </div>
            </div>
          )}
        </div>

        <ul>
          {/* おまじない */}
          {/* dailiesリストから一つ一つ取り出して、infoに代入して、そのinfoを使う */}
          {comments.map((info) => (
            // infoの中には、id、author、contextの3つが入っている(データベースはこの3つを格納しているから)
            <li key={info.id} className="pb-2">
              {info.author}: {info.context}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
