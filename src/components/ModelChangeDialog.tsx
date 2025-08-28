import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ModelChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentModel: LLMModel | null;
  newModel: LLMModel | null;
  onConfirm: () => void;
  messageCount: number;
}

export function ModelChangeDialog({ 
  open, 
  onOpenChange, 
  currentModel, 
  newModel, 
  onConfirm,
  messageCount 
}: ModelChangeDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Switch Model?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              You're currently chatting with <strong>{currentModel?.name}</strong> and have{' '}
              <strong>{messageCount} message{messageCount !== 1 ? 's' : ''}</strong> in this conversation.
            </p>
            <p>
              Switching to <strong>{newModel?.name}</strong> will continue the conversation, 
              but the new model may interpret the conversation differently.
            </p>
            <p className="text-sm text-muted-foreground">
              Tip: Consider starting a new chat for the best experience with different models.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Switch to {newModel?.name}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}