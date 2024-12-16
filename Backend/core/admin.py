from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from core.models import User

# Formulário para criar um novo usuário
class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(
        label="Senha",
        widget=forms.PasswordInput,
        help_text="A senha deve ter no mínimo 6 caracteres."
    )
    password2 = forms.CharField(
        label="Confirmação de Senha",
        widget=forms.PasswordInput,
        help_text="Repita a senha."
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'cargo', 'password1', 'password2')

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if len(username) < 5:
            raise forms.ValidationError("O nome de usuário deve ter pelo menos 5 caracteres.")
        return username

    def clean_password1(self):
        password1 = self.cleaned_data.get("password1")
        if len(password1) < 6:
            raise forms.ValidationError("A senha deve ter pelo menos 6 caracteres.")
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("As senhas não coincidem.")
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])  # A senha é definida aqui
        if commit:
            user.save()
        return user


# Formulário para editar o usuário existente
class CustomUserChangeForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'cargo')


# Personalizando o admin do usuário
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('username', 'email', 'cargo')
    list_filter = ('cargo',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('email', 'cargo')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'cargo', 'password1', 'password2')}
        ),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)


# Registrando o modelo de usuário no admin
admin.site.register(User, CustomUserAdmin)
