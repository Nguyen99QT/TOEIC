#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Validate audio files in the backend resources directory.
This script:
1. Checks if audio files are readable
2. Analyzes audio properties (duration, amplitude, etc.)
3. Flags potentially problematic files (silent, too short, etc.)
4. Generates a report of audio quality issues
"""

import os
import sys
import json
import subprocess
from pathlib import Path

# Try to import librosa, install if missing
try:
    import librosa
    import numpy as np
except ImportError:
    print("Installing required packages...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "librosa", "numpy"])
    import librosa
    import numpy as np

# Directory paths
BACKEND_PATH = Path(os.path.dirname(os.path.abspath(__file__)))
AUDIO_PATH = BACKEND_PATH / "src" / "main" / "resources" / "static" / "audio" / "exercises"

# Thresholds for validation
MIN_DURATION = 1.0  # Minimum duration in seconds
MAX_DURATION = 60.0  # Maximum duration in seconds
MIN_RMS = 0.01  # Minimum RMS energy (to detect silent files)

def validate_audio_file(file_path):
    """
    Validate an audio file by checking its properties.
    
    Args:
        file_path: Path to the audio file
        
    Returns:
        A dictionary with validation results and audio properties
    """
    result = {
        "file": str(file_path),
        "filename": os.path.basename(file_path),
        "valid": False,
        "issues": [],
        "properties": {}
    }
    
    try:
        # Load audio file with librosa
        y, sr = librosa.load(file_path, sr=None)
        
        # Calculate properties
        duration = librosa.get_duration(y=y, sr=sr)
        rms = np.sqrt(np.mean(y**2))
        
        # Store properties
        result["properties"] = {
            "duration": duration,
            "sample_rate": sr,
            "rms_energy": float(rms),
            "num_samples": len(y)
        }
        
        # Validate duration
        if duration < MIN_DURATION:
            result["issues"].append(f"Too short: {duration:.2f}s < {MIN_DURATION}s")
        
        if duration > MAX_DURATION:
            result["issues"].append(f"Too long: {duration:.2f}s > {MAX_DURATION}s")
        
        # Validate volume
        if rms < MIN_RMS:
            result["issues"].append(f"Too quiet/silent: RMS energy {rms:.4f} < {MIN_RMS}")
        
        # Set validity
        result["valid"] = len(result["issues"]) == 0
        
    except Exception as e:
        result["issues"].append(f"Error: {str(e)}")
    
    return result

def main():
    """Main function to validate audio files."""
    if not AUDIO_PATH.exists():
        print(f"❌ Audio directory not found: {AUDIO_PATH}")
        return
    
    print(f"Validating audio files in: {AUDIO_PATH}")
    
    results = []
    issues_found = False
    
    # Process all ex*.mp3 files
    audio_files = sorted(AUDIO_PATH.glob("ex*.mp3"), 
                         key=lambda x: int(x.stem.replace("ex", "")))
    
    total_files = len(audio_files)
    print(f"Found {total_files} audio files to validate")
    
    for i, file_path in enumerate(audio_files, 1):
        print(f"Validating [{i}/{total_files}]: {file_path.name}...", end="")
        
        result = validate_audio_file(file_path)
        results.append(result)
        
        if result["valid"]:
            print(" ✅ Valid")
        else:
            issues_found = True
            print(" ❌ Issues found:")
            for issue in result["issues"]:
                print(f"   - {issue}")
    
    # Save detailed report as JSON
    report_json = BACKEND_PATH / "audio_validation_report.json"
    with open(report_json, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    # Generate a markdown summary report
    report_md = BACKEND_PATH / "audio_validation_report.md"
    with open(report_md, 'w', encoding='utf-8') as f:
        f.write("# Audio Files Validation Report\n\n")
        f.write(f"Generated on: {import datetime; datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## Summary\n\n")
        valid_files = sum(1 for r in results if r["valid"])
        f.write(f"- Total audio files: {total_files}\n")
        f.write(f"- Valid files: {valid_files}\n")
        f.write(f"- Files with issues: {total_files - valid_files}\n\n")
        
        if total_files - valid_files > 0:
            f.write("## Files with Issues\n\n")
            f.write("| File | Duration | RMS Energy | Issues |\n")
            f.write("|------|----------|------------|--------|\n")
            
            for result in results:
                if not result["valid"]:
                    file_name = result["filename"]
                    duration = result["properties"].get("duration", "N/A")
                    rms = result["properties"].get("rms_energy", "N/A")
                    issues = ", ".join(result["issues"])
                    
                    f.write(f"| {file_name} | {duration:.2f}s | {rms:.4f} | {issues} |\n")
        
        f.write("\n## All Files Properties\n\n")
        f.write("| File | Duration | Sample Rate | RMS Energy | Status |\n")
        f.write("|------|----------|-------------|------------|--------|\n")
        
        for result in sorted(results, key=lambda x: x["filename"]):
            file_name = result["filename"]
            props = result["properties"]
            duration = props.get("duration", "N/A")
            sr = props.get("sample_rate", "N/A")
            rms = props.get("rms_energy", "N/A")
            status = "✅ Valid" if result["valid"] else "❌ Issues"
            
            if isinstance(duration, (int, float)):
                duration = f"{duration:.2f}s"
            
            if isinstance(rms, (int, float)):
                rms = f"{rms:.4f}"
                
            f.write(f"| {file_name} | {duration} | {sr} | {rms} | {status} |\n")
    
    print(f"\n✅ Validation complete!")
    print(f"✅ Detailed report saved to: {report_json}")
    print(f"✅ Summary report saved to: {report_md}")
    
    if issues_found:
        print("\n⚠️ Some files have issues. Please check the reports for details.")
    else:
        print("\n✅ All files are valid!")

if __name__ == "__main__":
    main()
