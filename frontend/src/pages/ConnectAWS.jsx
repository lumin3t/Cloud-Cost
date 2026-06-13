import { useState } from "react";
import NavBar from "../components/NavBar";

export default function ConnectAWS() {

  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [region, setRegion] = useState("us-east-1");

  const connectAWS = async () => {

    try {

      const res = await fetch(
        "/api/connect-aws",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            access_key: accessKey,
            secret_key: secretKey,
            region: region
          })
        }
      );

      const data = await res.json();

      alert(data.message);

    } catch (err) {

      console.error(err);

      alert("Connection failed");
    }
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen flex items-center justify-center p-4">

        <div className="w-full max-w-2xl">

          <div className="text-center mb-8">

            <h1 className="text-lg text-text-title">
              Connect AWS
            </h1>

            <p className="mt-2 text-xs text-text/60">
              Connect your AWS account securely
            </p>

          </div>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="AWS Access Key"
              value={accessKey}
              onChange={(e) =>
                setAccessKey(e.target.value)
              }
              className="w-full p-3 rounded-xl bg-bg/20 border border-border"
            />

            <input
              type="password"
              placeholder="AWS Secret Key"
              value={secretKey}
              onChange={(e) =>
                setSecretKey(e.target.value)
              }
              className="w-full p-3 rounded-xl bg-bg/20 border border-border"
            />

            <input
              type="text"
              placeholder="Region"
              value={region}
              onChange={(e) =>
                setRegion(e.target.value)
              }
              className="w-full p-3 rounded-xl bg-bg/20 border border-border"
            />

            <button
              onClick={connectAWS}
              className="
                w-full
                py-3
                rounded-xl
                bg-purple-600
                text-white
                font-bold
                cursor-pointer
              "
            >
              Connect AWS
            </button>

          </div>

        </div>

      </div>
    </>
  );
}