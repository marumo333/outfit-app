import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useCookies } from "react-cookie"
import Compressor from 'compressorjs'
import { useForm } from 'react-hook-form'
import Link from "next/link";

const Profile = () => {
    const [file, setFile] = useState();
    const [user, setUser] = useState({name:'sei',iconUrl:'icon'}); // ユーザー情報を保持するステート
    const [compressedFile, setCompressedFile] = useState(null); // 圧縮されたファイルを保持するステート
    const [cookies, setCookie, removeCookie] = useCookies();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false); // ローディング状態
    const { register } = useForm();
    // ユーザー情報をフェッチする関数

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`https://railway.bookreview.techtrain.dev/users`, {
                headers: {
                    authorization: `Bearer ${cookies.token}` // トークンをヘッダーに追加
                }
            });
            setUser(response.data); // ユーザー情報をステートに設定
            console.log(response.data)
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || 'ユーザー情報の取得に失敗しました。';
                setError(errorMsg);
            } else {
                setError('予期しないエラーが発生しました。');
            }
            console.error('エラー発生', err);
        } finally {
            setLoading(false);
        }
   };
    
    useEffect(() => {
        fetchUser(); // コンポーネントがマウントされたときにユーザー情報をフェッチ
   }, []);
    
    useEffect(() => {
        axios.get('https://railway.bookreview.techtrain.dev/users',{
            headers: {
                authorization: `Bearer ${cookies.token}` // トークンをヘッダーに追加
            }
        })
            .then(res => {
                setFile(res.data)
            })
            .catch((error) => {
                console.error("エラー", error);
                setErrorMessage("データの取得に失敗しました。"); // エラーメッセージを設定
             });
    }, [])
    // ユーザー名を更新する関数
    const handleUpdateUserName = async () => {
        if (!user.name) {
            setError('名前を入力してください。');
            return;
        }
        console.log('put name',user.name)
        const data ={
        name:user.name,
        }
        try {
            const response = await axios.put('https://railway.bookreview.techtrain.dev/users',
                data, // 更新するデータ
                {
                    headers: {
                        authorization: `Bearer ${cookies.token}`
                    }
                }
            );
            setUser(response.data)
            console.log('レスポンス:', response.data);
            setSuccessMessage('ユーザー名が正常に更新されました。');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.message || 'ユーザー名の更新中にエラーが発生しました。';
                setError(errorMsg);
            } else {
                setError('予期しないエラーが発生しました。');
            }
            console.error('エラー発生', err);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; // 選択したファイルを保存
        console.log(selectedFile); // デバッグ用: 選択したファイルを確認

        if (selectedFile) {
            setFile(selectedFile);

            // 画像を圧縮する
            new Compressor(selectedFile, {
                quality: 0.8, // 圧縮率
                maxWidth: 100,
                maxHeight: 100,
                mimeType: 'image/jpeg',
                success: (compressedResult) => {
                    console.log(compressedResult); // 圧縮後のファイルを確認
                    setCompressedFile(URL.createObjectURL(compressedResult)); // 圧縮されたファイルのURLを保存
                    setFile(compressedResult); // 圧縮されたファイルを保存
                },
                error(err) {
                    console.error(err.message);
                    setError('画像の圧縮中にエラーが発生しました。');
                },
            });
        }
    };
    const handleUpload = async (e) => {
        e.preventDefault();
        console.log('aaaaa')
        if (!file) {
            setError('ファイルを選択してください。');
            return;
        }
        console.log('Uploading file:',file); // デバッグ用: アップロードするファイルを確認
        
        const formData={
            icon:file
        }
        axios.post(`https://railway.bookreview.techtrain.dev/uploads`,formData,{
            headers: {
                'Content-Type':'multipart/form-data',
                authorization: `Bearer ${cookies.token}`
            },
            responseType: "blob",
        })
        .then((response) => {
            setFile((response.data))
            console.log(response.data);
          })
        }
    
    
    
    return (
        <div>
            {loading ? (
                <p>読み込み中...</p>
            ) : user ? (
                <>
                    <p>{user.name}</p>
                    <p>アイコン:<img src={user.iconUrl} className="maxwidth:100 maxheight:100 alt=User Icon" /></p>
                    <p>更新済みアイコン:<img src={file} className="maxwidth:100 maxheight:100 alt=User Icon"/></p>
                </>
            ):(
                <p>ユーザー情報を読み込んでいます...</p>
            )}
            <input
                {...register('name', {
                    required: '必須入力',
                    maxLength: {
                        value: 50,
                        message: '最大50文字です'
                    },
                    pattern:
                        /^[A-Za-z0-9]+$/
                })}
                type="text"
                value={user.name}
                onChange={(e) => setUser({name:e.target.value})}
                placeholder="新しい名前"
                autoComplete="name"
            />
            <button type="update-button"onClick={handleUpdateUserName}>名前を更新</button>

            <form className="icon-upload" >
            <input
             accept="image/*" 
             multiple type="file" 
             value={user.file} 
             onChange={handleFileChange} 
             />
            <button type="upload-button" onClick={handleUpload}>アイコンをアップロード</button>
            {compressedFile && <img src={compressedFile} alt="Compressed" />}
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <Link href="Home">ホームに戻る</Link>
            </form>
        </div>
    );
};

export default Profile;