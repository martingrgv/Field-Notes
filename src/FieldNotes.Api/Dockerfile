FROM mcr.microsoft.com/dotnet/sdk:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Copy project file and restore dependencies
COPY FieldNotes.Api.csproj ./
RUN dotnet restore

# Copy source code
COPY . ./

# Start the application with hot reload
CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]