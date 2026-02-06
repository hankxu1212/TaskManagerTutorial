const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com",
                port: "",
                pathname: "/**",
            }
        ]
    }
};

export default nextConfig;
