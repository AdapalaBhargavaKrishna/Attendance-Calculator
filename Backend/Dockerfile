FROM node:18-slim

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    curl \
    unzip \
    gnupg \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    libxcomposite1 \
    libxrandr2 \
    libasound2 \
    libxdamage1 \
    libgbm1 \
    libx11-xcb1 \
    libgtk-3-0 \
    ca-certificates \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Chrome (v124)
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

# Install matching Chromedriver (v124.0.6367.118)
RUN wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/124.0.6367.118/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/chromedriver && \
    rm /tmp/chromedriver.zip

ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROMEDRIVER=/usr/local/bin/chromedriver

WORKDIR /app
COPY . .
RUN npm install

EXPOSE 3001
CMD ["node", "app.js"]
