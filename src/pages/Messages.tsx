
import { useState } from 'react';
import { ConversationList } from '@/components/messaging/ConversationList';
import { NewConversationDialog } from '@/components/messaging/NewConversationDialog';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function Messages() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>();
  const [showNewConversation, setShowNewConversation] = useState(false);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleNewConversation = () => {
    setShowNewConversation(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex">
      {/* Conversation List - Always visible on mobile, sidebar on desktop */}
      <div className={`
        w-full md:w-96 border-r border-border
        ${selectedConversationId ? 'hidden md:block' : 'block'}
      `}>
        <ConversationList
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          activeConversationId={selectedConversationId}
        />
      </div>

      {/* Chat View - Shown when conversation selected */}
      <div className={`
        flex-1
        ${selectedConversationId ? 'block' : 'hidden md:flex'}
      `}>
        {selectedConversationId ? (
          <div className="flex items-center justify-center h-full p-8">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Interface de chat en cours de développement
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Conversation ID: {selectedConversationId}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground mb-2">
                Sélectionnez une conversation
              </p>
              <p className="text-sm text-muted-foreground">
                Choisissez une conversation pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Dialog */}
      <NewConversationDialog
        open={showNewConversation}
        onOpenChange={setShowNewConversation}
        onConversationCreated={handleConversationCreated}
      />
    </div>
  );
}