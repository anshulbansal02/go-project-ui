import { Button, CodeInput, Modal } from "@/components";
import { Controller, useForm } from "react-hook-form";

interface RoomCodeModalProps {
  children: React.ReactElement;
  onSubmit: (data: RoomCodeForm) => void;
}

export function RoomCodeModal({ children, onSubmit }: RoomCodeModalProps) {
  const { handleSubmit, control } = useForm<RoomCodeForm>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resetOptions: {
      keepErrors: false,
    },
  });

  return (
    <Modal>
      <Modal.Trigger>{children}</Modal.Trigger>
      <Modal.Content>
        <div className='p-8'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className='mb-8 text-center'>Enter Room Code</h3>
            <Controller
              name='code'
              control={control}
              render={({ field }) => (
                <CodeInput
                  autoFocus
                  charset='alphanumeric'
                  length={6}
                  {...field}
                />
              )}
            />
            <Button className='w-full mt-4' type='submit'>
              Join Room
            </Button>
          </form>
        </div>
      </Modal.Content>
    </Modal>
  );
}

export type RoomCodeForm = {
  code: string;
};
