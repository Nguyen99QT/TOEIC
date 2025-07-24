import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

class AudioPlayerWidget extends StatefulWidget {
  final String audioUrl;

  const AudioPlayerWidget({
    super.key,
    required this.audioUrl,
  });

  @override
  State<AudioPlayerWidget> createState() => _AudioPlayerWidgetState();
}

class _AudioPlayerWidgetState extends State<AudioPlayerWidget> {
  late AudioPlayer _audioPlayer;
  PlayerState _playerState = PlayerState.stopped;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;
  bool _isLoading = false;
  String? _localFilePath;

  @override
  void initState() {
    super.initState();
    _audioPlayer = AudioPlayer();
    _initAudioPlayer();
  }

  Future<String?> _downloadAudioFile(String url) async {
    try {
      print('Downloading audio from: $url');
      
      final response = await http.get(Uri.parse(url));
      print('HTTP Response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final Directory tempDir = await getTemporaryDirectory();
        final String fileName = url.split('/').last;
        final File file = File('${tempDir.path}/$fileName');
        
        await file.writeAsBytes(response.bodyBytes);
        print('Audio downloaded to: ${file.path}');
        return file.path;
      } else {
        print('Failed to download audio: ${response.statusCode}');
        print('Response body: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error downloading audio: $e');
      return null;
    }
  }

  void _initAudioPlayer() {
    // Add minimal logging for debugging
    print('Audio player initialized');
    
    _audioPlayer.onPlayerStateChanged.listen((PlayerState state) {
      if (mounted) {
        setState(() {
          _playerState = state;
        });
      }
    });

    _audioPlayer.onDurationChanged.listen((Duration duration) {
      if (mounted) {
        setState(() {
          _duration = duration;
        });
      }
    });

    _audioPlayer.onPositionChanged.listen((Duration position) {
      if (mounted) {
        setState(() {
          _position = position;
        });
      }
    });
  }

  Future<void> _playPause() async {
    try {
      if (_playerState == PlayerState.playing) {
        await _audioPlayer.pause();
      } else {
        if (mounted) {
          setState(() {
            _isLoading = true;
          });
        }
        
        // Enhanced logging for debugging
        print('Attempting to play audio from URL: ${widget.audioUrl}');
        print('Audio URL length: ${widget.audioUrl.length}');
        print('Audio URL starts with: ${widget.audioUrl.substring(0, widget.audioUrl.length > 50 ? 50 : widget.audioUrl.length)}');
        
        // Stop any existing playback first
        await _audioPlayer.stop();
        
        // Try download method for better compatibility
        if (_localFilePath == null) {
          _localFilePath = await _downloadAudioFile(widget.audioUrl);
        }
        
        if (_localFilePath != null) {
          print('Playing from local file: $_localFilePath');
          await _audioPlayer.play(DeviceFileSource(_localFilePath!));
        } else {
          print('Download failed, trying direct URL');
          // Fallback to direct URL
          await _audioPlayer.play(UrlSource(widget.audioUrl));
        }
        
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
      
      // Log error details but don't expose URL
      print('Audio play error: ${e.runtimeType}');
      
      if (mounted) {
        String errorMessage = 'Không thể phát audio';
        
        if (e is TimeoutException) {
          errorMessage = 'File audio tải quá lâu. Vui lòng thử lại';
        } else if (e.toString().contains('404') || e.toString().contains('Not Found')) {
          errorMessage = 'File audio không tồn tại';
        } else if (e.toString().contains('network') || e.toString().contains('connection')) {
          errorMessage = 'Lỗi kết nối. Kiểm tra internet và thử lại';
        } else if (e.toString().contains('format') || e.toString().contains('codec')) {
          errorMessage = 'Định dạng audio không được hỗ trợ';
        } else if (e.toString().contains('permission')) {
          errorMessage = 'Không có quyền phát audio';
        } else if (e.toString().contains('MEDIA_ERROR')) {
          errorMessage = 'Lỗi hệ thống audio. File có thể bị hỏng';
        }
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(errorMessage),
            backgroundColor: Colors.red,
            action: SnackBarAction(
              label: 'Thử lại',
              textColor: Colors.white,
              onPressed: () => _playPause(),
            ),
          ),
        );
      }
    }
  }

  Future<void> _stop() async {
    await _audioPlayer.stop();
  }

  void _seek(Duration position) {
    _audioPlayer.seek(position);
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes);
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  String _getUrlStatus() {
    final url = widget.audioUrl.toLowerCase();
    
    if (url.isEmpty) {
      return 'Empty URL';
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      if (url.contains('.mp3') || url.contains('.wav') || 
          url.contains('.m4a') || url.contains('.aac')) {
        return 'Valid Audio URL';
      } else {
        return 'URL without audio extension';
      }
    } else if (url.startsWith('assets/')) {
      return 'Local Asset';
    } else {
      return 'Invalid URL format';
    }
  }

  @override
  Widget build(BuildContext context) {
    final urlStatus = _getUrlStatus();
    final isValidUrl = urlStatus.contains('Valid');
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isValidUrl ? Colors.blue[50] : Colors.orange[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isValidUrl ? Colors.blue[200]! : Colors.orange[200]!,
        ),
      ),
      child: Column(
        children: [
          // Header
          Row(
            children: [
              Icon(
                isValidUrl ? Icons.headphones : Icons.warning,
                size: 24,
                color: isValidUrl ? Colors.blue : Colors.orange,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  isValidUrl ? 'Audio Question' : 'Audio Issue',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isValidUrl ? Colors.blue : Colors.orange,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Status info without showing full URL
          Text(
            'Status: ${_getUrlStatus()}',
            style: TextStyle(
              fontSize: 12, 
              color: _getUrlStatus().contains('Valid') ? Colors.green : Colors.orange,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),

          // Progress bar
          if (_duration.inMilliseconds > 0) ...[
            SliderTheme(
              data: SliderTheme.of(context).copyWith(
                thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                trackHeight: 4,
              ),
              child: Slider(
                value: _position.inMilliseconds.toDouble(),
                max: _duration.inMilliseconds.toDouble(),
                onChanged: (value) {
                  _seek(Duration(milliseconds: value.toInt()));
                },
                activeColor: Colors.blue,
                inactiveColor: Colors.blue[200],
              ),
            ),
            
            // Time display
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _formatDuration(_position),
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                  Text(
                    _formatDuration(_duration),
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
          ],

          // Control buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Stop button
              if (_playerState != PlayerState.stopped) ...[
                IconButton(
                  onPressed: _stop,
                  icon: const Icon(Icons.stop),
                  color: Colors.grey[600],
                ),
                const SizedBox(width: 8),
              ],
              
              // Play/Pause button
              ElevatedButton.icon(
                onPressed: _isLoading ? null : _playPause,
                icon: _isLoading
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Icon(
                        _playerState == PlayerState.playing
                            ? Icons.pause
                            : Icons.play_arrow,
                      ),
                label: Text(
                  _isLoading
                      ? 'Đang tải...'
                      : _playerState == PlayerState.playing
                          ? 'Tạm dừng'
                          : 'Phát âm thanh',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }
}
