import 'package:flutter/material.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MKAIApplication());
}

class MKAIApplication extends StatelessWidget {
  const MKAIApplication({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'M.K AI — Your Intelligence. Your Control.',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF030712),
        primaryColor: const Color(0xFF06B6D4), // Cyan
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF06B6D4),
          secondary: Color(0xFF3B82F6),
          surface: Color(0xFF0F172A),
        ),
        fontFamily: 'Rajdhani',
      ),
      home: const DashboardScreen(),
    );
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final TextEditingController _textController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'content': 'Namaste! Main M.K AI hoon. Creator: Manish Meena. System ready on your device. Mode: Sovereign Auto.'
    }
  ];
  String _activePlatform = 'Windows 11 / Linux / Mobile';
  String _aiMode = 'AUTO (Gemini / Ollama)';

  void _sendMessage() {
    if (_textController.text.trim().isEmpty) return;
    final userText = _textController.text.trim();
    setState(() {
      _messages.add({'role': 'user', 'content': userText});
      _messages.add({
        'role': 'assistant',
        'content': 'Processed "$userText" via M.K AI Neural Bridge. Private memory intact. No unauthorized telemetry.'
      });
      _textController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF090D1A),
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: Color(0xFF06B6D4),
                boxShadow: [BoxShadow(color: Color(0xFF06B6D4), blurRadius: 10)],
              ),
            ),
            const SizedBox(width: 12),
            const Text('M.K AI', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF06B6D4).withOpacity(0.15),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.3)),
              ),
              child: const Text('SOVEREIGN', style: TextStyle(fontSize: 10, color: Color(0xFF06B6D4))),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.security, color: Color(0xFF06B6D4)),
            tooltip: 'Private Memory Vault',
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.white70),
            tooltip: 'System Settings',
            onPressed: () {},
          ),
        ],
      ),
      body: Row(
        children: [
          // Left Navigation (Desktop/Tablet)
          if (MediaQuery.of(context).size.width > 700)
            Container(
              width: 240,
              color: const Color(0xFF090D1A),
              child: ListView(
                padding: const EdgeInsets.all(12),
                children: [
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF06B6D4).withOpacity(0.2),
                      foregroundColor: const Color(0xFF06B6D4),
                      side: const BorderSide(color: Color(0xFF06B6D4)),
                    ),
                    icon: const Icon(Icons.add),
                    label: const Text('+ New Session'),
                    onPressed: () {},
                  ),
                  const SizedBox(height: 20),
                  const Text('SUBSYSTEMS', style: TextStyle(fontSize: 11, color: Colors.white38, letterSpacing: 1.5)),
                  const SizedBox(height: 8),
                  _navItem(Icons.chat_bubble_outline, 'Active Chat', true),
                  _navItem(Icons.memory, 'Memory Vault', false),
                  _navItem(Icons.terminal, 'Automation Deck', false),
                  _navItem(Icons.remove_red_eye_outlined, 'Computer Vision', false),
                  _navItem(Icons.extension_outlined, 'Plugin Manager', false),
                  const Divider(color: Colors.white12, height: 30),
                  const Text('CREATOR', style: TextStyle(fontSize: 11, color: Colors.white38, letterSpacing: 1.5)),
                  const SizedBox(height: 4),
                  const Text('Manish Meena', style: TextStyle(fontSize: 13, color: Colors.white70)),
                ],
              ),
            ),

          // Main Chat Area
          Expanded(
            child: Column(
              children: [
                // Top Status Bar
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  color: const Color(0xFF0C1322),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Platform: $_activePlatform', style: const TextStyle(fontSize: 12, color: Colors.white60)),
                      Text('AI Mode: $_aiMode', style: const TextStyle(fontSize: 12, color: Color(0xFF06B6D4))),
                    ],
                  ),
                ),

                // Messages List
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final msg = _messages[index];
                      final isUser = msg['role'] == 'user';
                      return Align(
                        alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(14),
                          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                          decoration: BoxDecoration(
                            color: isUser ? const Color(0xFF1E293B) : const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isUser ? const Color(0xFF334155) : const Color(0xFF06B6D4).withOpacity(0.3),
                            ),
                          ),
                          child: Text(
                            msg['content'] ?? '',
                            style: const TextStyle(fontSize: 15, color: Colors.white, height: 1.4),
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Input Bar
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: Color(0xFF090D1A),
                    border: Border(top: BorderSide(color: Colors.white10)),
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.mic, color: Color(0xFF06B6D4)),
                        tooltip: 'Voice Input (Hinglish/Hindi/English)',
                        onPressed: () {},
                      ),
                      IconButton(
                        icon: const Icon(Icons.attach_file, color: Colors.white60),
                        tooltip: 'Attach Document or Image',
                        onPressed: () {},
                      ),
                      Expanded(
                        child: TextField(
                          controller: _textController,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Transmit directive to M.K AI (Hindi/English)...',
                            hintStyle: const TextStyle(color: Colors.white38),
                            filled: true,
                            fillColor: const Color(0xFF131C31),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          onSubmitted: (_) => _sendMessage(),
                        ),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        style: IconButton.styleFrom(
                          backgroundColor: const Color(0xFF06B6D4),
                          foregroundColor: Colors.black,
                        ),
                        icon: const Icon(Icons.send_rounded),
                        onPressed: _sendMessage,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _navItem(IconData icon, String label, bool active) {
    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        color: active ? const Color(0xFF06B6D4).withOpacity(0.12) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: ListTile(
        dense: true,
        leading: Icon(icon, color: active ? const Color(0xFF06B6D4) : Colors.white60, size: 20),
        title: Text(
          label,
          style: TextStyle(
            color: active ? Colors.white : Colors.white70,
            fontWeight: active ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        onTap: () {},
      ),
    );
  }
}
