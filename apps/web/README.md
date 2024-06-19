<div align="center"><img src="public/logo.svg" width="300" height="200" /></div>
<div align="center">
<h1>Yomu</h1>
<h3>Next.js web client for Yomu</h3>
<div align="center">
    <a href="https://github.com/AGN907/Yomu/releases/latest">
      <img alt="Latest release" src="https://img.shields.io/github/v/release/AGN907/yomu?style=for-the-badge&logo=starship&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41&include_prerelease&sort=semver" />
    </a>
    <a href="https://hub.docker.com/r/agn907/yomu">
    <img alt="Docker image size" src="https://img.shields.io/docker/image-size/agn907/yomu?style=for-the-badge&logo=docker&color=C9CBFF&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    </div>
</div>

## Features

- Browse the latest and trending novels from different third-party sources
- Search for your favorite novels
- Keep track of your novels
- Update novels for new chapters on the fly
- Search through your history of chapters
- Manage your novels with multiple categories

## Getting Started

As the web client is self-hosted you will need to make sure you have `Docker/Docker Desktop` installed to run it.

To install docker and docker desktop follow the instructions [here](https://docs.docker.com/desktop/install/)

After that you can clone the repository and navigate to the root of the folder.

```shell
git clone https://github.com/AGN907/yomu.git
cd yomu
```

From here you can simply copy and paste this into your terminal:

```shell
// You can add `-d` to run it in the background
docker compose -f ./apps/web/docker-compose.yml up
```

Now visit http://localhost:3000 in your browser to see the web client.

> [!NOTE]
> You will need to create an account the first time you run the web client.
