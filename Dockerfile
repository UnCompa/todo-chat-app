FROM oven/bun:1.1.6

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./
COPY src ./src

RUN bun install

EXPOSE 3000

CMD ["bun", "src/index.ts"]
