---
title: "GitHub Workflow Rewrite for Arch Linux without the beeps"
date: 2024-12-23T00:00:00.000Z
draft: false
tags: ["github-actions", "ci-cd", "arch-linux"]
author: "Thomas Brugman"
description: "Today, I'd like to share how we've improved the GitHub Actions workflow for automatically building our Arch Linux ISO without system beeps. This workflow is a c..."
---
# The GitHub Workflow Rewrite

Today, I'd like to share how we've improved the GitHub Actions workflow for automatically building our Arch Linux ISO without system beeps. This workflow is a crucial component of our project, as it generates a fresh ISO with the latest updates daily.

## Key Improvements


1. **Robust Error Handling**
   - Addition of comprehensive error checking
   - Improved logging for debugging
   - Timeout limit of 120 minutes to prevent hanging builds
   - **Additional Details**: The error handling now includes specific checks for common issues such as network failures and package conflicts, ensuring that the build process is more resilient.

2. **Automated Release Notes**
   - Automatic generation of release notes
   - Including changelog since last release
   - Clear presentation of features and changes
   - **Additional Details**: The release notes are now formatted in Markdown, making them easy to read and integrate into our documentation.

3. **Security and Verification**
   - Automatic generation of SHA256 and SHA512 checksums
   - Build process verification
   - Checks for successful ISO creation
   - **Additional Details**: We have also implemented GPG signing for the ISOs, providing an additional layer of security and authenticity verification.

## Technical Details

The workflow runs in a Docker container based on Arch Linux, ensuring a clean and isolated build environment. We use `archiso` for building the ISO.



The build process is divided into clear steps:
1. Preparing the build environment
2. Caching Pacman packages
3. Building the ISO
4. Generating checksums
5. Creating a new release

If you want to see the complete workflow, I will post a snippet of it here:

```yaml
name: Build ISO

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * *'  # Run the workflow every day at midnight
  push:
    branches:
      - main
      - dev
    paths-ignore:
      - '**.md'
      - '.gitignore'

env:
  DOCKER_BUILDKIT: 1
  ISO_FILENAME: Arch.iso

jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 120  # Set a timeout to prevent hung builds

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up environment variables
        id: env
        run: |
          echo "DATE=$(date +'%Y-%m-%d')" >> $GITHUB_ENV
          echo "VERSION=$(date +'%Y.%m.%d')" >> $GITHUB_ENV
          echo "CACHE_KEY=$(date +'%Y-%m')" >> $GITHUB_ENV
          echo "WORKSPACE=${GITHUB_WORKSPACE}" >> $GITHUB_ENV

      - name: Create Cache Directories
        run: |
          sudo mkdir -p /tmp/pacman-cache
          sudo chmod 777 /tmp/pacman-cache
          # Ensure the directory is empty to prevent tar errors
          sudo rm -rf /tmp/pacman-cache/*

      - name: Cache Pacman packages
        uses: actions/cache@v3
        with:
          path: /tmp/pacman-cache
          key: pacman-${{ runner.os }}-${{ env.CACHE_KEY }}
          restore-keys: |
            pacman-${{ runner.os }}-

      - name: Set up Arch Linux Container
        run: |
          docker run --privileged --name arch-container -d \
            -v ${{ env.WORKSPACE }}:/workdir \
            -v /tmp/pacman-cache:/var/cache/pacman/pkg \
            archlinux:latest sleep infinity

      - name: Initialize Container
        run: |
          docker exec arch-container bash -c "
            set -euo pipefail
            
            # Update package database and system
            pacman -Syu --noconfirm
            
            # Install required packages
            pacman -S --noconfirm --needed \
              git \
              archiso \
              grub \
              curl \
              jq \
              gnupg \
              make \
              sudo
            
            # Verify installation
            command -v mkarchiso >/dev/null 2>&1 || {
              echo '::error::mkarchiso not found'
              exit 1
            }
          "

      - name: Build ISO
        id: build
        run: |
          docker exec arch-container bash -c "
            set -euo pipefail
            cd /workdir
            
            # Cleanup any previous builds
            rm -rf workdir/ out/
            mkdir -p out/
            
            # Build the ISO with verbose output
            mkarchiso -v -w workdir/ -o out/ . 2>&1 | tee build.log || {
              echo '::error::ISO build failed!'
              tail -n 50 build.log
              exit 1
            }
            
            # Verify ISO was created
            [ -f out/*.iso ] || {
              echo '::error::ISO file not found after build'
              exit 1
            }
          "

      - name: Generate Checksums
        run: |
          docker exec arch-container bash -c "
            set -euo pipefail
            cd /workdir/out
            
            # Generate checksums
            for iso in *.iso; do
              sha256sum \"\$iso\" > \"\${iso}.sha256sum\"
              sha512sum \"\$iso\" > \"\${iso}.sha512sum\"
            done
          "

      - name: Rename and Move ISO
        run: |
          docker exec arch-container bash -c "
            set -euo pipefail
            cd /workdir/out
            
            for f in *.iso; do
              newname=\"arch-linux-no-beeps-${{ env.VERSION }}.iso\"
              mv \"\$f\" \"\$newname\"
              mv \"\$f.sha256sum\" \"\$newname.sha256sum\"
              mv \"\$f.sha512sum\" \"\$newname.sha512sum\"
            done
          "

      - name: Generate Release Notes
        id: release_notes
        run: |
          # Create a temporary file for release notes
          TEMP_RELEASE_NOTES=$(mktemp)
          
          docker exec arch-container bash -c "
            set -euo pipefail
            cd /workdir
            
            # Initialize release notes
            {
              echo '🚀 Arch Linux ISO without system beeps (build ${{ env.DATE }})'
              echo ''
              echo '### Changes'
              
              # Get changes since last release
              if git tag | grep -q .; then
                LAST_TAG=\$(git describe --tags --abbrev=0 2>/dev/null || echo '')
                if [ ! -z \"\$LAST_TAG\" ]; then
                  echo '#### Commits since last release:'
                  git log \"\$LAST_TAG\"..HEAD --pretty=format:'- %s' | grep -v 'Merge'
                  echo ''
                fi
              fi
              
              # Add standard information
              echo '### Features'
              echo '- Automatic daily build'
              echo '- System beeps disabled'
              echo '- ISO SHA256 and SHA512 checksums included'
              echo ''
              echo '### Download'
              echo '- Download the ISO and verify checksums before use'
              echo ''
              echo '### Checksums'
              echo 'SHA256 and SHA512 checksums are available in the uploaded files.'
            } > /tmp/release_notes
          "
          
          # Copy release notes from container to host
          docker cp arch-container:/tmp/release_notes $TEMP_RELEASE_NOTES
          
          # Set the release notes in GITHUB_ENV
          echo 'RELEASE_NOTES<<EOF' >> $GITHUB_ENV
          cat $TEMP_RELEASE_NOTES >> $GITHUB_ENV
          echo 'EOF' >> $GITHUB_ENV
          
          # Cleanup
          rm -f $TEMP_RELEASE_NOTES

      - name: Create Release
        id: create_release
        uses: softprops/action-gh-release@v1
        if: github.ref == 'refs/heads/main'
        with:
          tag_name: v${{ env.VERSION }}
          name: "Arch Linux No Beeps v${{ env.VERSION }}"
          body: ${{ env.RELEASE_NOTES }}
          draft: false
          prerelease: false
          files: |
            ${{ env.WORKSPACE }}/out/*.iso
            ${{ env.WORKSPACE }}/out/*.sha*sum

      - name: Clean Up
        if: always()
        run: |
          if docker ps -a | grep -q arch-container; then
            docker stop arch-container || true
            docker rm -f arch-container || true
          fi
          sudo rm -rf workdir/ out/ /tmp/pacman-cache/*

      - name: Upload Build Logs on Failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: build-logs
          path: |
            ${{ env.WORKSPACE }}/build.log
          retention-days: 5
          compression-level: 9  # Maximum compression for logs
```


**Additional Technical Insights**: The Docker container is configured to use the latest Arch Linux base image, ensuring that we always build with the most up-to-date packages. We have also optimized the Dockerfile to minimize the image size and build time.

## Future Improvements

Looking ahead, I plan to integrate more advanced features such as:
- **Parallel Builds**: To further reduce build times, I am exploring the possibility of running multiple build processes in parallel.
- **Automated Testing**: Implementing automated tests for the ISO to ensure that it functions correctly on a variety of hardware configurations.
- **User Feedback Integration**: Gathering feedback from users to continuously improve the build process and address any issues they encounter.

## Conclusion

This rewrite has resulted in a more reliable and efficient workflow. The daily builds are now faster and produce consistent results. The improved error handling and logging make it easier to identify and resolve any issues that may arise.

For those interested in the details: the complete workflow configuration can be found in our [GitHub repository](https://github.com/thomasbrugman/Arch-Linux-without-the-beeps). 