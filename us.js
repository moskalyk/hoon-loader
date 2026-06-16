console.log(process.hrtime())

function log(l){
    console.log(l)
}

async function test(data) {
  log(`Message: ${data}`);
  try {
    // Generate keys
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      {
        name: "Ed25519",
      },
      true,
      ["sign", "verify"],
    );
    log(`publicKey: ${JSON.stringify(publicKey)}, type: ${publicKey.type}`);
    log(`privateKey: ${privateKey},  type: ${privateKey.type}`);

var enc = new TextEncoder()
    // Sign the data using the private key.
    const signature = await crypto.subtle.sign(
      {
        name: "Ed25519",
      },
      privateKey,
      enc.encode("This is a a string to be converted to a Uint8Array"),
    );

    // Verify the signature using the public key
    const verifyResult = await crypto.subtle.verify(
      {
        name: "Ed25519",
      },
      publicKey,
      signature,
      enc.encode("This is a a string to be converted to a Uint8Array"),
    );

    // // Log result - true if the text was signed with the corresponding public key.
    alert(`signature verified?: ${verifyResult}`);
  } catch (error) {
    log(error);
  }
  
  
};

// test('nero')
