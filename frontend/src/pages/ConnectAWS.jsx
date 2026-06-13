import NavBar from "../components/NavBar";

export default function ConnectAWS() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-lg text-text-title">
            Connect to AWS
          </h1>
          <p className="mt-2 text-xs text-text/60">
            Follow the steps below to securely connect your AWS account
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">

          <div className="rounded-2xl border border-border/50 bg-bg/20 p-3 text-center">
            <div className="text-xs text-purple-400/80 mb-1">Step 01</div>
            <p className="text-xs text-text-title/80">
              Create an IAM user in your AWS account.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg/20 p-3 text-center">
            <div className="text-xs text-purple-400/80 mb-1">Step 02</div>
            <p className="text-xs text-text-title/80">
              Attach read-only policies (Cost Explorer, EC2, S3, CloudWatch).
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 bg-bg/20 p-3 text-center">
            <div className="text-xs text-purple-400/80 mb-1">Step 03</div>
            <p className="text-xs text-text-title/80">
              Add AWS credentials (Access Key + Secret Key) securely.
            </p>
          </div>

        </div>

        {/* Footer hint */}
        <div className="mt-6 text-xs text-text/50 text-center">
          Read-only permissions only no modifications made!
        </div>

      </div>
    </div>
   </>
  );
}
