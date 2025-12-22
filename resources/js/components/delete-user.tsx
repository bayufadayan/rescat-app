import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="rounded-2xl bg-white shadow-sm border border-red-200 p-6">
            <div className="flex items-start gap-3 mb-4">
                <div className="rounded-full bg-red-50 p-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Delete Account</h3>
                    <p className="text-sm text-gray-600">
                        Permanently delete your account and all of its resources
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 mb-4">
                <p className="text-sm font-medium text-red-900 mb-1">Warning</p>
                <p className="text-sm text-red-700">
                    Please proceed with caution, this cannot be undone.
                </p>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                        data-test="delete-user-button"
                    >
                        Delete Account
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        Are you sure you want to delete your account?
                    </DialogTitle>
                    <DialogDescription>
                        Once your account is deleted, all of its resources
                        and data will also be permanently deleted. Please
                        enter your password to confirm you would like to
                        permanently delete your account.
                    </DialogDescription>

                    <Form
                        {...ProfileController.destroy.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        onError={() => passwordInput.current?.focus()}
                        resetOnSuccess
                        className="space-y-6"
                    >
                        {({ resetAndClearErrors, processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="sr-only"
                                    >
                                        Password
                                    </Label>

                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        ref={passwordInput}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                        className="border-gray-200"
                                    />

                                    <InputError message={errors.password} className="text-red-600" />
                                </div>

                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                resetAndClearErrors()
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>

                                    <Button
                                        variant="destructive"
                                        disabled={processing}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete Account
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
