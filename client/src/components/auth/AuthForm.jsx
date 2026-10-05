const AuthForm = ({
  error,
  formData,
  isRegistering,
  loading,
  onChange,
  onSubmit,
  onToggleMode,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg border shadow-sm"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isRegistering ? "Create account" : "Login"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isRegistering
            ? "Create a simple profile to order and see your orders."
            : "Login to your Numisora profile."}
        </p>
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Username
      </label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={onChange}
        required
        className="border p-3 mb-4 w-full rounded"
      />

      {isRegistering && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="border p-3 mb-4 w-full rounded"
          />
        </>
      )}

      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
        required
        minLength={isRegistering ? 6 : undefined}
        className="border p-3 mb-4 w-full rounded"
      />

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white p-3 rounded transition disabled:opacity-70"
      >
        {loading
          ? "Please wait..."
          : isRegistering
            ? "Create account"
            : "Login"}
      </button>

      <button
        type="button"
        onClick={onToggleMode}
        className="w-full mt-4 text-gray-700 underline"
      >
        {isRegistering
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </form>
  );
};

export default AuthForm;
