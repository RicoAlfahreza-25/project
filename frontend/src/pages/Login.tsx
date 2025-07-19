import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend authentication API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Login Berhasil",
          description: `Selamat datang, ${data.data.user.name}`,
        });
        
        // Determine redirect based on user role
        const redirect = data.data.user.role === 'admin' ? '/dashboard' : '/branch-dashboard';
        login(data.data.user, data.data.token, redirect);
      } else {
        toast({
          title: "Login Gagal",
          description: data.message || "Email atau password salah",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghubungi server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-muted to-background p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Koperasi Simpan Pinjam
          </CardTitle>
          <CardDescription>
            Masuk ke sistem manajemen koperasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-muted"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground space-y-1">
            <p className="font-medium">Demo Login Credentials:</p>
            <div className="text-xs space-y-1">
              <p><strong>Admin:</strong> admin@koperasi.com / admin123</p>
              <p><strong>Jakarta:</strong> jakarta@koperasi.com / jakarta123</p>
              <p><strong>Surabaya:</strong> surabaya@koperasi.com / surabaya123</p>
              <p><strong>Bandung:</strong> bandung@koperasi.com / bandung123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}