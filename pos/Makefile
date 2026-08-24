SHELL := /bin/zsh
.DEFAULT_GOAL := build

GRADLE ?= $(shell if [ -x ./gradlew ]; then echo ./gradlew; elif command -v gradle >/dev/null 2>&1; then echo gradle; fi)

.PHONY: help build debug clean install run check-android-tooling

help:
	@echo "Targets:"
	@echo "  make         # build debug APK"
	@echo "  make build   # build debug APK"
	@echo "  make debug   # build debug APK"
	@echo "  make run     # install debug APK to connected Android device"
	@echo "  make install # install debug APK to connected Android device"
	@echo "  make clean   # clean Android build artifacts"

check-android-tooling:
	@test -n "$(GRADLE)" || (echo "Missing Gradle. Open pos/ in Android Studio or install Gradle/Android SDK command-line tooling."; exit 1)
	@test -n "$$ANDROID_HOME" -o -n "$$ANDROID_SDK_ROOT" || (echo "Missing Android SDK path. Set ANDROID_HOME or ANDROID_SDK_ROOT, or open pos/ in Android Studio and install the SDK."; exit 1)

build: debug

debug: check-android-tooling
	$(GRADLE) assembleDebug

install: check-android-tooling
	$(GRADLE) installDebug

run: install

clean: check-android-tooling
	$(GRADLE) clean
