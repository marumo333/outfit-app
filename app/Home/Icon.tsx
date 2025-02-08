"use client"
import Image from "next/image";
import React,{FC} from "react";

type Props = {
  url: string;
};

const Icon: FC<Props> = ({ url }) => {
  
  return (
    <div>
      {url ? (
        <Image
          src={url}
          alt="Avatar"
          width={200}
          height={200}
          style={{ borderRadius: "50%" }}
          unoptimized={true} 
        />
      ) : (
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: "gray" }} />
      )}
    </div>
  );
};

export default Icon;
